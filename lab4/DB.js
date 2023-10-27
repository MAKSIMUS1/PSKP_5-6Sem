const EventEmitter = require('events');

let db_data = [
    { id: 1, name: "test1", bday: '2001-01-01' },
    { id: 2, name: "test2", bday: '2002-01-01' },
    { id: 3, name: "test3", bday: '2003-01-01' },
];

class DB extends EventEmitter {
    select() { return db_data; };
    insert(object) 
    { 
        if(/^\d+$/.test(object.id))
        {
            if(Number(object.id) <= 0)
            {
                return null;
            }
        }else{
            return null;
        }
        if(Date.parse(object.bday) > Date.parse('2023-10-10') || Date.parse(object.bday) < Date.parse('2022-01-01'))
        {
            return null;
        }
        if(db_data.some(o => o.id == object.id))
        {
            return null;
        }
        else
        {
            db_data.push(object);
            return object; 
        }
    };
    update(object) { 
        if(/^\d+$/.test(object.id))
        {
            if(Number(object.id) <= 0)
            {
                return null;
            }
        }else{
            return null;
        }
        
        if(Date.parse(object.bday) > Date.parse('2023-10-10') || Date.parse(object.bday) < Date.parse('2023-01-01'))
        {
            return null;
        }
        if(db_data.some(o => o.id == object.id))
        {
            db_data = db_data.map((post) => (
                post.id == object.id
                  ? { ...post, name: object.name, bday: object.bday }
                  : post
              )); 
            return object;
        }
        else
        {
            return null; 
        }
    };
    delete(object) { 
        if(/^\d+$/.test(object.id))
        {
            if(Number(object.id) <= 0)
            {
                return null;
            }
        }else{
            return null;
        }
        if(db_data.some(o => o.id == object.id))
        {
            db_data = db_data.filter(value => value.id != object.id); 
            return object;
        }
        else
        {
            return null; 
        }
    };
}

exports.DB = DB; 