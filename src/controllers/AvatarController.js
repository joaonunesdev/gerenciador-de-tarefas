const sharp = require('sharp');

exports.store = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.usuario.avatar = buffer;
    await req.usuario.save();
    res.send();
}

exports.show = async (req, res) => {
    res.send(req.usuario);
}

exports.destroy = async (req, res) => {
    req.usuario.avatar = undefined;
    await req.usuario.save();
    res.send();
}