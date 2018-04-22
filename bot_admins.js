

// list of people who are trustworthy of not breaking my server
const botAdmins = [ "253784341555970048",  // @ridderhoff
                    "186157998538883092",  // @fsm
                    "182591843584704522"]; // @silverwood

// export list
module.exports.list = botAdmins;

// is given user trustworthy
module.exports.auth = id => {
    return !!botAdmins.find(adminID => {
        return id == adminID;
    });
};
