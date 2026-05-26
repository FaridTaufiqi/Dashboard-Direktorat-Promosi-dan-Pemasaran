function cleanRupiah(val) {
  if (!val) return 0;
  let s = val.toString().trim();
  
  // if it contains 'Rp', remove 'Rp' and everything before it
  s = s.replace(/^.*?Rp\.?\s*/i, '');
  
  // replace commas or dots that are thousands separators
  // A comma or dot followed by exactly 2 digits at the end is a decimal
  const match = s.match(/([.,])\d{2}$/);
  if (match) {
    // remove the last 3 characters temporarily, strip other separators, then add back
    const decimal = s.slice(-3).replace(/[.,]/, '.');
    const integerStr = s.slice(0, -3).replace(/[^0-9-]/g, '');
    return parseFloat(integerStr + decimal) || 0;
  } else {
    // just strip all non-digits
    return parseInt(s.replace(/[^0-9-]/g, ''), 10) || 0;
  }
}
console.log(cleanRupiah("Rp1,000,000"));
console.log(cleanRupiah("Rp. 1.000.000,00"));
console.log(cleanRupiah("50000"));
console.log(cleanRupiah("-Rp 1,000"));
console.log(cleanRupiah(""));
console.log(cleanRupiah("Rp1,000,000.50"));
