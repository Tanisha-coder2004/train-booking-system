import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { CreditCard, Smartphone, Landmark, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../hooks/useAuth";
import "./Payment.scss";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [holdData, setHoldData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"IDLE" | "SUCCESS">("IDLE");

  useEffect(() => {
    const data = localStorage.getItem('currentHold');
    if (data) {
      const parsed = JSON.parse(data);
      setHoldData(parsed);

      if (parsed.expiry_timestamp) {
        const remaining = Math.max(0, Math.floor((parsed.expiry_timestamp - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
    } else {
      navigate('/search');
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (holdData) {
        showToast("Your seat hold has expired. Please search again.", "error");
        localStorage.removeItem('currentHold');
        navigate('/search');
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate, holdData, showToast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    if (!holdData?.holdId) return;

    try {
      // 1. Get Order ID from Backend
      const orderData = await api.initiatePayment(holdData.holdId);

      // 2. Open Razorpay Modal
      const options = {
        key: orderData.key_id,
        amount: orderData.totalFare * 100,
        currency: "INR",
        name: "TrainTick Official",
        description: "Secure Train Ticket Booking",
        order_id: orderData.razorpay_order_id,
        handler: async (response: any) => {
          // 3. Verify Payment Signature
          setIsVerifying(true);
          try {
            await api.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              holdId: holdData.holdId
            });

            setPaymentStatus("SUCCESS");
            setTimeout(() => {
              localStorage.removeItem('currentHold');
              navigate(`/confirmation/${holdData.holdId}`);
            }, 1500);
          } catch (err) {
            console.error("Verification failed:", err);
            setIsVerifying(false);
            showToast("Payment verification failed. Please contact support.", "error");
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || ""
        },
        theme: {
          color: "#1e293b"
        },
        modal: {
          ondismiss: function() {
            console.log("Checkout modal closed by user");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment initiation failed:", err);
      showToast("Failed to initiate payment. Please try again.", "error");
    }
  };

  if (!holdData) return null;

  return (
    <div className="payment-page">
      {(isVerifying || paymentStatus === "SUCCESS") && (
        <div className="mock-gateway-overlay">
          <div className="gateway-modal">
            <div className="modal-content">
              {isVerifying && (
                <>
                   <div className="spinner"></div>
                   <h2>Verifying Transaction</h2>
                   <p>Securing your seats and finalising PNR...</p>
                </>
              )}
              {paymentStatus === "SUCCESS" && (
                <>
                  <div className="success-icon"><CheckCircle2 size={48} /></div>
                  <h2>Payment Successful</h2>
                  <p>Your seats are secured. Redirecting...</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="booking-stepper">
          <div className="step completed"><span><CheckCircle2 size={14} /></span> Selection</div>
          <div className="line active"></div>
          <div className="step active"><span>2</span> Payment</div>
          <div className="line"></div>
          <div className="step"><span>3</span> Confirmation</div>
        </div>
      </div>

      <div className="payment-container">
        <main className="payment-main">
          <div className="timer-section card">
            <Clock size={18} />
            <p>Seats held. Pay within <strong>{formatTime(timeLeft)}</strong></p>
          </div>

          <div className="methods-section">
            <h2>Select Payment Method</h2>
            <div className="methods-list">
              <div
                className={`method-item card ${selectedMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('upi')}
              >
                <div className="method-icon"><Smartphone size={22} /></div>
                <div className="method-info">
                  <h3>UPI Payment</h3>
                  <span>Google Pay, PhonePe, BHIM</span>
                </div>
              </div>

              <div
                className={`method-item card ${selectedMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <div className="method-icon"><CreditCard size={22} /></div>
                <div className="method-info">
                  <h3>Credit / Debit Card</h3>
                  <span>Visa, Mastercard, RuPay</span>
                </div>
              </div>

              <div
                className={`method-item card ${selectedMethod === 'net' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('net')}
              >
                <div className="method-icon"><Landmark size={22} /></div>
                <div className="method-info">
                  <h3>Net Banking</h3>
                  <span>All major Indian banks</span>
                </div>
              </div>
            </div>
          </div>

          <div className="method-details card">
            {selectedMethod === 'upi' && (
              <div className="form-group">
                <label>VPA / UPI ID</label>
                <div className="input-row">
                  <input type="text" placeholder="username@bank" />
                  <button>Verify</button>
                </div>
              </div>
            )}
            {selectedMethod === 'card' && (
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="***" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className="payment-sidebar">
          <div className="summary-sticky card">
            <h3>Fare Summary</h3>
            <div className="summary-row">
              <span className="label">Base Amount ({holdData.passengersCount} Pax)</span>
              <span className="val">₹{holdData.totalFare}</span>
            </div>
            <div className="summary-row">
              <span className="label">Service Fee</span>
              <span className="val">₹45</span>
            </div>
            <div className="summary-row total">
              <span className="label">Total Amount</span>
              <span className="val">₹{holdData.totalFare + 45}</span>
            </div>

            <div className="trust-badges">
              <div className="badge"><ShieldCheck size={14} /> PCI-DSS Secure</div>
              <div className="badge"><CheckCircle2 size={14} /> Verified Merchant</div>
            </div>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isVerifying}
            >
              {isVerifying ? 'Processing...' : `Pay ₹${holdData.totalFare + 45}`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Payment;
