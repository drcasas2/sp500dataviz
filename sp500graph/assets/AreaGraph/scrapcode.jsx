
console.log(data);
const data2 = Object.entries(data).map(([key, value]) => [key, value]);
console.log(data2);
console.log(data2[0][1][1]);
console.log(data2[0][1][0]);

const data3 = data2.map(([_, value]) => [value[1], value[0]]);
console.log(data3);