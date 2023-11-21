<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login successfully</title>
</head>
<body>
    <h1>Đăng nhập thành công!</h1>
</body>
<script type="text/javascript">
    const r = <?php echo json_encode($response); ?>;
    window.opener.postMessage(r, 'http://localhost:3000/');
</script>
</html>