#ifndef CORKI_BOT_LOL_MASTERY_LOG
#define CORKI_BOT_LOL_MASTERY_LOG

#include<string>
#include <inttypes.h>


struct data_point_t {
    uint64_t timestamp;
    uint32_t score;
};

bool updateLog(const char* userid); // difficulty: hard
std::string getChampMasteryHistory(const char* userid, const uint16_t champId); // difficulty: easy

/* file format:
~/.corki/users/___user_id___/lol_cm_log
```
\n`champion:`___champ_id___\n                          -- cwill be written out to prevent misinterpretation
data_point_t[]                                         -- this will be raw
... repeating ...EOF?
```

*/

#endif
