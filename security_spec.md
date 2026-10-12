# Security Specification: Stackd Bombay Shared Media & Admin Access

## 1. Data Invariants
1. **Public Read Integrity**: Public visitors can read `/site_media/{mediaId}` and `/reels/{reelId}` to view published brand images and customer review videos without authentication.
2. **Admin-Only Mutations**: Only authorized administrators (authenticated with verified email matching `sanianousheen35@gmail.com` or registered in `/admins/{adminId}`) can create, update, or delete `/site_media/{mediaId}` and `/reels/{reelId}`.
3. **Payload Sanitization**: Media documents cannot exceed defined string limits or inject arbitrary ghost fields.
4. **Admin Protection**: Non-admins cannot read or write to `/admins/{adminId}`.
5. **Default Deny**: All unmapped collections and wildcard paths default to `allow read, write: if false;`.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Anonymous Media Write**: Unauthenticated user attempting to write `/site_media/founder`.
2. **Unverified Email Injection**: User with `email_verified == false` attempting to modify `/site_media/tin`.
3. **Ghost Field Poisoning**: Payload containing undeclared fields (e.g., `isSuperAdmin: true`) on `/site_media/ingredients`.
4. **Oversized Media Injection**: Payload attempting to write an ID longer than 128 characters or URL longer than 3MB.
5. **Anonymous Reel Deletion**: Unauthenticated user attempting to delete `/reels/reel-1`.
6. **Self-Escalation to Admin**: Non-admin user attempting to write a new document in `/admins/{uid}` with `role: "admin"`.
7. **Cross-User Admin Read**: Standard user attempting to list or get all documents in `/admins`.
8. **Malicious Path Injection**: Write with invalid document ID containing path traversal characters like `../../hack`.
9. **Missing Required Fields**: Writing a reel without a `name` or `videoUrl`.
10. **Type Mismatch Attack**: Submitting an integer or array for the `mediaId` string field.
11. **Negative Order Value**: Submitting NaN or invalid type for reel `order`.
12. **Catch-All Wildcard Exploit**: Attempting to read or write an arbitrary collection `/secret_data`.
