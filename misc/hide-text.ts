const v1 = "operator precedence";
const v2 = `------------ = 16
2　  ᠎᠎ 16 * 2 = 32　  32/8 = 4
8　  ᠎᠎ 8 * 1 = 8
------------- = 1
`;

const L1 = v1.length;
const L2 = v2.length;

const every = Math.floor(L2 / L1) + (Math.random() >= 0.8 ? 1 : 0);

var out = [...v2];

for (let i = 0; i < v1.length; i++) {
  const char = v1[i];
  const targetIndex = (i + 1) * every;

  out.splice(targetIndex, 0, char);
}

console.log(out.join(""));
