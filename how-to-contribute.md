# How to Contribute

Thank you for your interest in contributing to the Train Ticket Booking System!

## General Guidelines

- All contributions are welcome: bug fixes, documentation, tests, backend features, or improvements.
- Please open an issue to discuss major changes before submitting a pull request (PR).
- All code changes must be made via pull requests. Direct pushes to main branches are not allowed.

## Contribution Process

1. **Fork the repository**
2. **Clone your fork**
   ```
   git clone https://github.com/your-username/train-booking-system.git
   ```
3. **Create a new branch** for your feature or fix:
   ```
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
   - For backend: Add code in the `backend/` folder (see backend/docs for API and DB guidelines)
   - For frontend: Add code in the `frontend/` folder
   - Update/add tests if needed
   - Update documentation if your change affects it
5. **Commit your changes**
   ```
   git add .
   git commit -m "<concise description>"
   ```
6. **Push to your fork**
   ```
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**
   - Go to the main repo on GitHub and click "Compare & pull request"
   - Fill out the PR template and describe your changes
   - Link any related issues

## Backend Contributions

- If you want to add backend features, please check the `backend/docs/` folder for API contracts, database calls, and architecture notes.
- Coordinate with the project maintainer (currently the frontend developer) before making major backend changes.
- If you are unsure about the backend direction, open an issue or discussion first.

## Code Style

- Follow the existing code style for both frontend and backend.
- Run `npm run lint` in the frontend before committing.
- Write clear commit messages and PR descriptions.

## Reviewing and Merging

- All PRs will be reviewed by the project maintainer.
- Address all review comments before merging.
- Squash commits if requested.

## Questions?

Open an issue or start a discussion if you have questions about contributing!
