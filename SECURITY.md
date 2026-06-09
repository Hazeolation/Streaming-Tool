# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes             |
| N-1     | ⚠️ Depends on age  |
| Older   | ❌ No              |

We recommend always using the latest version of the Streaming Tool for the best security posture.

## Reporting a Vulnerability

**Please do not create public GitHub issues for security vulnerabilities.** Instead, please report security issues privately to ensure they can be addressed before being publicly disclosed.

### How to Report

1. **Email** — Send a detailed report to the project maintainers (check repository for contact information)
2. **GitHub Security Advisory** — Use GitHub's [security advisory](https://docs.github.com/en/code-security/security-advisories/about-github-security-advisories) feature
3. **Private Discussion** — Start a [private security discussion](https://docs.github.com/en/code-security/security-advisories/privately-reporting-a-security-vulnerability) if available

### What to Include

Please include the following in your report:

- **Description** — Clear explanation of the vulnerability
- **Steps to Reproduce** — How to trigger or reproduce the issue
- **Impact** — What could an attacker accomplish?
- **Affected Components** — Which part(s) of the code are vulnerable (Backend/Frontend/Database/etc.)
- **Affected Versions** — Which versions are impacted?
- **Suggested Fix** — If you have ideas for a fix (optional)

## Security Best Practices for Users

### Backend (ASP.NET Core)

- Keep `.NET` and all dependencies up to date
- Use HTTPS for all communications
- Regularly review and update API authentication/authorization
- Keep database credentials secure and use environment variables
- Enable SQL parameterization to prevent SQL injection
- Implement rate limiting on API endpoints
- Monitor logs for suspicious activity

### Frontend (Angular)

- Keep `Angular` and dependencies up to date
- Use `npm audit` regularly to check for vulnerabilities
- Follow [OWASP Top 10](https://owasp.org/www-project-top-ten/) security practices
- Avoid storing sensitive data in localStorage
- Sanitize user inputs to prevent XSS attacks
- Implement Content Security Policy (CSP) headers

### General

- Update all dependencies regularly: `npm audit fix` and `dotnet package update`
- Review third-party package dependencies for known vulnerabilities
- Use strong authentication mechanisms (2FA where applicable)
- Implement proper logging and monitoring
- Keep backups of critical data
- Test security fixes thoroughly before deploying

## Security Updates

When a security vulnerability is identified and fixed:

1. A patch will be released as soon as possible
2. Security updates will be announced via:
   - GitHub Security Advisory
   - Release notes with `security` tag
   - Project notifications
3. Users are encouraged to update immediately

## Dependency Management

We regularly monitor dependencies using:

- `npm audit` for Node.js packages
- `dotnet list package --outdated` for NuGet packages
- GitHub's dependency scanning and automated security alerts

## Questions?

If you have security-related questions or concerns, please reach out privately to the maintainers rather than posting publicly.
