fetch('http://localhost:3000/api/platform/meta')
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
