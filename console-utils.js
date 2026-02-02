// console-utils.js
// Attach hashPassword to the global window so you can call it from the console
window.hashPassword = async function (password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

console.log("hashPassword() is ready to use. Example: hashPassword('mypassword').then(console.log)");
