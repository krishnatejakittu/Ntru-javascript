function randr(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function powMod(base, exponent, modulus) 
{
    if (modulus === 1n)
		return 0n
    let result = 1n
    base = base % modulus
    
    while (exponent > 0n)
    {
        if (exponent % 2n === 1n)
            result = (result * base) % modulus
        exponent = exponent >> 1n
        base = (base * base) % modulus
    }
    return result
}

function modInv(a, b)
{
	let b0 = b, t, q;
	let x0 = 0n, x1 = 1n;
	if (b == 1n) return 1n;
	while (a > 1n)
	{
		if(b == 0n) return 1n
		
		q = a / b;
		t = b, b = a % b, a = t;
		t = x0, x0 = x1 - q * x0, x1 = t;
	}
	if (x1 < 0n) x1 += b0;
	return x1;
}

function rstr(length) 
{
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *  charactersLength));
   }
   return result;
}

/**
 * Returns a hash hex from a string
 * @param  {String} str The string to hash.
 * @return {Number}    hash hex
 */
function hashCode(str, p) {
	
    const n = str2n(str)
    
    return hash(n, prime)
}

function str2n(str)
{
    let n = 0n
    
    for (let i = 0, len = str.length; i < len; i++)
        n = (n << 8n) | BigInt(str.charCodeAt(i))
    
    return n	
}

function mask(n)
{
	return (1n << n) - 1n
}

function msb(n)
{
	
	let i = 0n
	while((n = (n >> 1n)) > 0n)
		i++
		
	return i
}

function genRand(bitlen)
{
	let n = 0n
	
	for(let i = 0n; i < bitlen; i++)
		n = (n << 1n) | BigInt(randr(0, 1))
	
    return n
}

function hash(n, p)
{
	return modInv(n, p)
}

function nhash(n, h)
{
	while(n--)
		h = hash(h)
		
	return h
}

function genHKey(f, p, q)
{
    const g = hash((f % p), p) % q;
    const fq = modInv((f % p), q)

    return (fq * g) % q
}

function genKeys(p, q)
{
    const r = genRand(msb(p));
    return [r, genHKey(r, p, q)]
}

function NTRUEncrypt(m, h, p , q)
{
    const r = genRand(msb(p));
    
    return ((r * p * h) + m) % q
}

function NTRUDecrypt(e, f, p, q)
{
    const fp = modInv(f, p)
    const a = (e * f) % q
    const b = a % p
    const c = (b * fp) % p;

    return c;
}

function NTRUSign(msg, f, p, q)
{
    let m = hash(msg, p)
    return NTRUEncrypt(0n, (modInv(m, q) * f) % q);
}

function NTRUVerify(msg, sign, h, p, q)
{
	let m = hash(msg, p)
    let d = NTRUDecrypt(sign, (h * m) % q);

    return (d == 0n)
}

console.log('test crypto')

const p = 2n**256n - 189n
const q = 2n**1279n - 1n		
		
let [f, h] = genKeys(p, q);

let msg = genRand(msb(p));

let enc = NTRUEncrypt(msg, h, p, q);
let dec = NTRUDecrypt(enc, f, p, q)

console.log('f   :', f.toString(16))
console.log('h   :', h.toString(16))
console.log('msg :', msg.toString(16));
console.log('enc :', enc.toString(16));
console.log('dec :', dec.toString(16));
console.log('==  :', msg == dec)
