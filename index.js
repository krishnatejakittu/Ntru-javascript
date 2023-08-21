const BN = require('bn.js');
const crypto = require('crypto');

const q = new BN(2, 10).pow(new BN(1279, 10)).sub(new BN(1, 10));
const p = new BN(2, 10).pow(new BN(256, 10)).sub(new BN(189, 10));
const size = p.bitLength()

function genRand(size)
{
	let mask = new BN(1, 10).shln(size).sub(new BN(1, 10))
    	return new BN(crypto.randomBytes((size >> 3) + 1).toString('hex'), 16).and(mask);
}

function hash(data)
{
    	return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

function bnhash(n)
{
	return new BN(hash(n).toString('hex'), 16)
}

function bnbase64(n)
{
	return n.toBuffer().toString('base64')
}

function base64bn(str)
{
	return new BN(str, 64);
}

function genKeys(size, p)
{
    	let f = bnhash(genRand(p.bitLength()));
    	let g = bnhash(f);
	
    	let fq = f.invm(q);
    	let h = (p.mul(fq).mul(g)).mod(q);
   
    	return [f, h]
}

function NTRUEncrypt(m, h)
{
    	let r = genRand(size);
    	return (r.mul(h).add(m)).mod(q);
}

function NTRUDecrypt(e, f)
{
    	let fp = f.invm(p);
    
    	let a = (f.mul(e)).mod(q);
    	let b = a.mod(p);
    	let c = (fp.mul(b)).mod(p);
   
    	return c;
}

function vanityGen(reg, c)
{
    	let re = new RegExp(reg);
    	let keys;
   
    	while(c.isub(new BN(1, 10)))
        	if(re.test(bnbase64((keys = genKeys(size, p))[1])))
            		break;

    	return c.isZero() ? [new BN(0, 10), new BN(0, 10)] : keys;
}

let [f, h] = genKeys(size, p)

let msg = genRand(p.bitLength());
let enc = NTRUEncrypt(msg, h);
let dec = NTRUDecrypt(enc, f)


console.log('f   :', bnbase64(f))
console.log('h   :', bnbase64(h))
console.log('msg :', bnbase64(m));
console.log('enc :', bnbase64(enc));
console.log('dec :', bnbase64(dec));

/*
let re = '^bit.*$';
let keys = vanityGen(re, new BN(1024 * 1024, 10))
console.log(bnbase64(keys[1]));
*/
