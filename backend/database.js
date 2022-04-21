const bcrypt = require('bcrypt')

let users = {
    users: [
        { id: 1, username: 'warodom', password: '$2b$10$0AsMSQaUB0AlLnKzgeUOfOE.hWUodtuR4NOU954XLVy2gy3lBWsdO', email: 'wwarodom@gmail.com' },
        { id: 2, username: 'john', password: '$2b$10$1Bu4tImM/Ms9rtU.8/n/COWpzUAGFB6YlsO5xZqFih1JUxafyFFXa', email: 'john@gmail.com' },
    ]
}
let Blacklists = {
    list : [
        {id:1,name:"ธนาพิพัฒน์ อัสนี"  ,products:"เทรดหุ้น"  ,details:"เขาจะมาในรูปแบบเหมือนจะช่วยเราเทรดหุ้น แล้วก็มาขอเป็นแฟนบอกจะสร้างอนาคตแล้วจะมาขอ ให้เรากดรับดอกเบี้ยทุกวัน เขาก้อจะส่งการสร้างตัวตนมาให้เราทุกวัน ที่รู้มาประมาณนี้ค่ะเพราะน้าโดน น้าลงไม่เป็นเลยลงให้ ตอนนี้เขาได้บล้อคไลน์ไปแล้วค่ะ",cost :8000},
        {id:2,name:"วิสาขา สุขภิรย์"    ,products:"เสื้อผ้า"    ,details :"โอนเงินค่าเอฟผ้าแล้ว แต่ไม่ยอมส่งเสื้อผ้ามาให้",cost :689},
        {id:3,name:"ณัฐวุฒิ ธรรมสละ"  ,products:"โน๊ตบุคมือสอง"  ,details :"ตกลงซื้อขายโน๊ตบุ๊ค ผู้ขายไม่ส่งโน๊ตบุ๊คตามตกลง",cost :5000}
    
    ]
    
}
const SECRET = 'your_jwt_secret'
const NOT_FOUND = -1

exports.Blacklists = Blacklists
exports.users = users 
exports.SECRET = SECRET
exports.NOT_FOUND = NOT_FOUND

exports.setUsers = function(_users) { 
  users = _users;
}

// === validate username/password ===
exports.isValidUser = async (username, password) => { 
    const index = users.users.findIndex(item => item.username === username) 
    return await bcrypt.compare(password, users.users[index].password)
}

// return -1 if user is not existing
exports.checkExistingUser = (username) => {
    return users.users.findIndex(item => item.username === username)
}