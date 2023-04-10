let values = ["string 1", "string 2", "string 3"];
let shifted;
console.log(`Values before removal: ${values}`);
while ((shifted = values.shift()) != "string 2") {
  values.push(shifted);
}
values.sort();

console.log(`Values after removal: ${values}`);
