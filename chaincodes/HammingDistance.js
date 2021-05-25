


var hexMap = {
    '0' : "0000",
    '1' : "0001",
    '2' : "0010",
    '3' : "0011",
    '4' : "0100",
    '5' : "0101",
    '6' : "0110",
    '7' : "0111",
    '8' : "1000",
    '9' : "1001",
    'a' : "1010",
    'b' : "1011",
    'c' : "1100",
    'd' : "1101",
    'e' : "1110",
    'f' : "1111"
};

function compareHexStrings(a, b) {
    aBinary = toBinary(a);
    bBinary = toBinary(b);

    var hammingDistance = 0;

    for (var i = 0; i < aBinary.length; i++) { 
        if (aBinary[i] != bBinary[i]) {
            hammingDistance++;
        }
    }

    return hammingDistance;
}

function toBinary(a) {
    a = a.replace("0x","");
    var aBinary = "";

    for (var i = 0; i < a.length; i++) {
        aBinary = aBinary + hexMap[a[i]];    
    }


    return aBinary;
}




module.exports = compareHexStrings