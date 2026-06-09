# CONTRIBUTING

Thank you for wanting to contribute to the DSB Streaming Tool repository!
This document explains how to report bugs, propose new features, and create pull requests.

## 1. Getting Started

1. Fork the repository.
2. Clone your fork locally:
    ```bash
    git clone https://github.com/<your-username>/Streaming-Tool.git
    ```
3. Add the original repository as upstream:
    ```bash
    git remote add upstream https://github.com/Hazeolation/Streaming-Tool.git
    ```
4. Update your local copy before starting new work:
    ```bash
    git fetch upstream
    git switch master
    git merge upstream/master
    ```

## 2. Development Setup

### Backend

- Project path: `Backend/DSB.StreamBackend/DSB.StreamBackend.csproj`
- Technology: ASP.NET Core 9, SignalR, SQLite
- Start the backend in Visual Studio or with `dotnet run` from `Backend/DSB.StreamBackend`.
- Configuration files:
    - `appsettings.json`
    - `appsettings.Development.json`

### Frontend

- Project path: `Frontend/control-panel`
- Technology: Angular
- Install dependencies:
    ```bash
    cd Frontend/control-panel
    npm install
    ```
- Start the frontend:
    ```bash
    npm start
    ```
- The control panel is usually available at `http://localhost:4200`.

> [!IMPORTANT]
> The backend and frontend should run together locally so overlays update live via SignalR.

## 3. What You Can Contribute

- Bug reports and reproduction steps
- Fixes for existing features
- New overlay components or control panel improvements
- Documentation and screenshots
- Tests or build workflow improvements

## 4. Style and Quality

- Write clear, concise commit messages.
- Keep branch names short and meaningful, e.g. `fix/[Issue#]-scorebox-update` or `feature/[Issue#]-map-screen`.
- Follow existing conventions for Angular and C# code.
- Avoid unrelated formatting changes in files unless they are part of your contribution.

## 5. Pull Request Process

1. Create a new branch from `master`.
2. In your PR, describe:
    - What changed
    - Why the change was needed
    - How it was tested
3. Link relevant issues if applicable.
4. Make sure your branch is based on the latest `master` before opening the PR.

## 6. Bug Reports and Feature Requests

- Open issues when you find a bug or want to suggest an improvement.
- Describe the behavior as precisely as possible.
- Include reproduction steps, expected behavior, and screenshots if available.

## 7. Testing and Verification

- Backend: Run any existing tests if available and verify locally.
- Frontend: Check changes in the browser against the control panel and overlay pages.
- Ensure key SignalR and overlay features still work.

## 8. License and Legal

By contributing, you agree that your code will be used under this repository's license.

## 9. Questions?

If anything is unclear, please open an issue or contact the repository team through GitHub Discussions / Issues.
