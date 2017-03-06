$().ready(function() {
  $("#center").validate({
	    rules: {
	      username: {
	        required: true,
	        minlength: 6
	      },
	      password: {
	        required: true,
	        minlength: 6
	      },
	      
	    },
	    messages: {
	      username: {
	        required: "请输入用户名",
	        minlength: "用户名长度不能小于 6 个字母"
	      },
	      password: {
	        required: "请输入密码",
	        minlength: "密码长度不能小于 6 个字母"
	      },
	    }
	});
  });

