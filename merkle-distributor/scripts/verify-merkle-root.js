"use strict";
exports.__esModule = true;

var fs_1 = require("fs");
var ethers_1 = require("ethers");

var json = JSON.parse(fs_1.readFileSync("res.json", { encoding: 'utf8' }));
var combinedHash = function (first, second) {
    if (!first) {
        return second;
    }
    if (!second) {
        return first;
    }
    return Buffer.from(ethers_1.utils.solidityKeccak256(['bytes32', 'bytes32'], [first, second].sort(Buffer.compare)).slice(2), 'hex');
};
var toNode = function (index, account, amount) {
    var pairHex = ethers_1.utils.solidityKeccak256(['uint256', 'address', 'uint256'], [index, account, amount]);
    return Buffer.from(pairHex.slice(2), 'hex');
};
var verifyProof = function (index, account, amount, proof, root) {
    var pair = toNode(index, account, amount);
    for (var _i = 0, proof_1 = proof; _i < proof_1.length; _i++) {
        var item = proof_1[_i];
        pair = combinedHash(pair, item);
    }
    return pair.equals(root);
};
var getNextLayer = function (elements) {
    return elements.reduce(function (layer, el, idx, arr) {
        if (idx % 2 === 0) {
            // Hash the current element with its pair element
            layer.push(combinedHash(el, arr[idx + 1]));
        }
        return layer;
    }, []);
};
var getRoot = function (balances) {
    var nodes = balances
        .map(function (_a) {
        var account = _a.account, amount = _a.amount, index = _a.index;
        return toNode(index, account, amount);
    })
        // sort by lexicographical order
        .sort(Buffer.compare);
    // deduplicate any eleents
    nodes = nodes.filter(function (el, idx) {
        return idx === 0 || !nodes[idx - 1].equals(el);
    });
    var layers = [];
    layers.push(nodes);
    // Get next layer until we reach the root
    while (layers[layers.length - 1].length > 1) {
        layers.push(getNextLayer(layers[layers.length - 1]));
    }
    return layers[layers.length - 1][0];
};
if (typeof json !== 'object')
    throw new Error('Invalid JSON');
var merkleRootHex = json.merkleRoot;
var merkleRoot = Buffer.from(merkleRootHex.slice(2), 'hex');
var balances = [];
var valid = true;
Object.keys(json.claims).forEach(function (address) {
    var claim = json.claims[address];
    var proof = claim.proof.map(function (p) { return Buffer.from(p.slice(2), 'hex'); });
    balances.push({ index: claim.index, account: address, amount: ethers_1.BigNumber.from(claim.amount) });
    if (verifyProof(claim.index, address, claim.amount, proof, merkleRoot)) {
        console.log('Verified proof for', claim.index, address);
    }
    else {
        console.log('Verification for', address, 'failed');
        valid = false;
    }
});
if (!valid) {
    console.error('Failed validation for 1 or more proofs');
    process.exit(1);
}
console.log('Done!');
// Root
var root = getRoot(balances).toString('hex');
console.log('Reconstructed merkle root', root);
console.log('Root matches the one read from the JSON?', root === merkleRootHex.slice(2));
