const test = (options) => {
    re = new RegExp("/patients/\\d{1,}/$");
    console.log(options.input.match(re));
}

test({input: "/patients/2474751/"})