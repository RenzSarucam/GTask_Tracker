<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ config('app.name') }}</title>
</head>
<body style="margin:0; padding:0; background-color:#0b0d1a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0d1a; padding:40px 16px;">
<tr>
<td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%;">

<tr>
<td style="padding-bottom:24px; text-align:center;">
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr>
<td style="width:36px; height:36px; background:linear-gradient(135deg,#7c5cff,#6a48f5); border-radius:10px; text-align:center; vertical-align:middle;">
<span style="color:#ffffff; font-size:18px; line-height:36px;">&#10003;</span>
</td>
<td style="padding-left:10px; color:#f1f2f8; font-size:16px; font-weight:700; vertical-align:middle;">
{{ config('app.name') }}
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="background-color:#141729; border:1px solid #2a2f4a; border-radius:16px; overflow:hidden;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="height:4px; background:linear-gradient(90deg,#7c5cff,#a78bfa,#7c5cff); font-size:0; line-height:0;">&nbsp;</td>
</tr>
<tr>
<td style="padding:36px 32px 32px;">
<h1 style="margin:0 0 8px; color:#f1f2f8; font-size:20px; font-weight:700; text-align:center;">
Welcome, {{ $name }}
</h1>
<p style="margin:0 0 28px; color:#8b90ab; font-size:14px; line-height:1.6; text-align:center;">
An admin created an account for you. Use these credentials to sign in.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1c2036; border:1px solid #2a2f4a; border-radius:10px; margin-bottom:28px;">
<tr>
<td style="padding:16px 20px;">
<p style="margin:0 0 4px; color:#8b90ab; font-size:12px;">Email</p>
<p style="margin:0 0 14px; color:#f1f2f8; font-size:14px; font-weight:600;">{{ $email }}</p>
<p style="margin:0 0 4px; color:#8b90ab; font-size:12px;">Temporary password</p>
<p style="margin:0; color:#f1f2f8; font-size:18px; font-weight:700; letter-spacing:1px;">{{ $password }}</p>
</td>
</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
<tr>
<td style="border-radius:10px; background:linear-gradient(135deg,#7c5cff,#6a48f5);">
<a href="{{ $loginUrl }}" style="display:inline-block; padding:12px 28px; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none;">
Sign in
</a>
</td>
</tr>
</table>

<p style="margin:0; color:#8b90ab; font-size:13px; line-height:1.6; text-align:center;">
For your security, change this password after signing in.
</p>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding-top:24px; text-align:center;">
<p style="margin:0; color:#4b5075; font-size:12px;">
&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>
