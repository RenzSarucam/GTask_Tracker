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
Verify your email
</h1>
<p style="margin:0 0 28px; color:#8b90ab; font-size:14px; line-height:1.6; text-align:center;">
Enter this code to finish setting up your account.
</p>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
<tr>
@foreach (str_split($code) as $digit)
<td style="width:44px; height:52px; background-color:#1c2036; border:1px solid #7c5cff; border-radius:10px; text-align:center; vertical-align:middle; color:#f1f2f8; font-size:24px; font-weight:700; padding:0 3px;">
{{ $digit }}
</td>
<td style="width:6px;">&nbsp;</td>
@endforeach
</tr>
</table>

<p style="margin:0 0 4px; color:#8b90ab; font-size:13px; line-height:1.6; text-align:center;">
This code expires in <strong style="color:#f1f2f8;">10 minutes</strong>.
</p>
<p style="margin:0; color:#8b90ab; font-size:13px; line-height:1.6; text-align:center;">
Didn&rsquo;t request this? You can safely ignore this email.
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
