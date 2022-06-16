const test = (value) => {
    console.log(!Number.isNaN(parseInt(value, 10)));
}

test("10")