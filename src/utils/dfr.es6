var dfr_waitAll;
(function(){
	dfr_waitAll = function(dfrs) {
		return class_Dfr.run((resolve, reject) => {
			var count = dfrs.length;
			var arr = new Array(count);
			var error;

			dfrs.forEach((dfr, i) => dfr.then(val => tick(null, val, i), tick));

			function tick(err, val, i){
				if (error != null) {
					return;
				}
				if (err) {
					reject(error = err);
					return;
				}
				arr[i] = val;
				if (--count === 0) {
					resolve(arr);
				}
			}
		});
	};
}());