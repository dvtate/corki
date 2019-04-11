#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <algorithm>
#include <unistd.h>
#include <sys/types.h>
#include <pwd.h>
#include <cstring>
#include <fstream>
#include <sstream>

#include "mastery_log.hpp"

/// I don't think I've written C++ code this ugly and disordered in a long time
/// most of this should be rewritten using ideas discussed here:
///      https://courses.cs.vt.edu/~cs2604/fall00/binio.html

/// thankfully this was just to put down ideas and isn't currently in use



///
// Util
///

// user directory string
static inline const char* getHomeDir() {
    // "/home/user"
    const char* homedir;
    if ((homedir = getenv("HOME")) == NULL)
        homedir = getpwuid(getuid())->pw_dir;
    return homedir;
}

// might get used /shrug
constexpr size_t conststrlen(const char* s) {
    size_t ret = 0;

    while (*(s + ret))
        ret++;

    return ret - 1;
}

// filename of users dir file
static inline const char* getFileName(const char* userid) {
    const char* home = getHomeDir();
    constexpr const char* usersDir = "/.corki/users/";
    // const userid
    constexpr const char* lf_name = "/lol_cm_log";

    char* ret = (char*) malloc(strlen(home) + strlen(usersDir) + strlen(userid) + strlen(lf_name) + 1);
    strcpy(ret, home);
    strcat(ret, usersDir);
    strcat(ret, userid);
    strcat(ret, lf_name);

    return ret;
}

// read a file into a std::string
static inline std::string readFile(const char* fname) {
    // read file as std::string
    std::ifstream t(fname);
    std::ostringstream buffer;
    buffer <<t.rdbuf();
    return buffer.str();
}

// read a file into a std::string
static inline std::string readFile(const std::string& fname) {
    // read file as std::string
    std::ifstream t(fname);
    std::ostringstream buffer;
    buffer <<t.rdbuf();
    return buffer.str();
}


static inline std::string readLog(const char* userid, const char* lf = "/lol_cm_log") {
    const char* home = getHomeDir();
    constexpr const char* usersDir = "/.corki/users/";
    // const userid

    char fname[strlen(home) + strlen(usersDir) + strlen(userid) + strlen(lf) + 1];
    strcpy(fname, home);
    strcat(fname, usersDir);
    strcat(fname, userid);
    strcat(fname, lf);
    return readFile(fname);

}

static inline FILE* getCacheFile(const char* userid, const char* lf = "/lol_cm_log") {
    const char* home = getHomeDir();
    constexpr const char* usersDir = "/.corki/users/";
    // const userid

    char fname[strlen(home) + strlen(usersDir) + strlen(userid) + strlen(lf) + 1];
    strcpy(fname, home);
    strcat(fname, usersDir);
    strcat(fname, userid);
    strcat(fname, lf);
    return fopen(fname, "r");
}

/* ?
template<class T>
static inline T readLog(const char* userid, T (*func)(const char*), const char* lf = "/lol_cm_log") {
    const char* home = getHomeDir();
    constexpr const char* usersDir = "/.corki/users/";
    // const userid

    char fname[strlen(home) + strlen(usersDir) + strlen(userid) + strlen(lf) + 1];
    strcpy(fname, home);
    strcat(fname, usersDir);
    strcat(fname, userid);
    strcat(fname, lf);
    return func(fname);
}
*/








///
// implementation
///




bool updateLog(const char* userid) {

    /* cached user mastery from user_mastery.js
    ** user/lol-mastery.c_parse
    timestamp
    champid:pts
    champid:pts
    champid:pts
    ...
    */

    // switch to use ifstream...

    std::string log = readLog(userid);
    FILE* new_data = getCacheFile(userid, "lol-mastery.c_parse");

    size_t line_size = 10;
    char* line = (char*) malloc(line_size);
    getline(new_data, &line, &line_size);
    int64_t ts = std::atoll(line);
    while (getline(new_data, &line, &line_size)) {

    }

    // use getline to go through the cache file and update corresponding champids

    // get timestamp
    // append new datapoints to each champ (create new entries for new champs)

    // for each champ id
    auto cs = log.find("\nlol_champion: ");

    // insert data_point_t immediately after label

    return cs;
}

static inline std::string cmJsonStringify(const struct data_point_t pts[], const size_t len) {
    std::string ret = "[";
    for (size_t i = 0; i < len; i++)
        ret += "{\"t\":" + std::to_string(pts[i].timestamp)
             + ",\"s\":" + std::to_string(pts[i].score) + "},";
    if (ret.length() > 1)
        ret.at(ret.length() - 1) = ']';
    else
        ret += ']';

    return ret;
}
std::string getChampMasteryHistory(const char* userid, uint16_t champId) {

    std::string log = readLog(userid);
    const std::string label = "\nlol_champion: " + std::to_string(champId);
    auto cd = log.find(label);
    auto cd_end = log.find("\nlol_champion:", cd + 1);
    const std::string data = log.substr(cd, cd_end);
    std::cout <<"cd: " <<cd <<" cd_end: " <<cd_end;
    std::cout <<"len: " <<((cd_end - cd) / sizeof(data_point_t)) <<std::endl;
    return cmJsonStringify((struct data_point_t*) data.c_str(), (cd_end - cd) / sizeof(data_point_t));
}
