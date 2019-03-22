#include <cstdlib>
#include <cstdio>
#include "mastery_log.hpp"

// NOTE: this isn't compatibile with windows afaik

/*
usege:
    ./tool <user_id>                # update user's mastery info
    ./tool <user_id> <champ_id>     # get user mastery history for specific champ

*/

int main(int argc, char** argv) {
    if (argc < 2)
        return 1;

    if (argc == 2) {
        updateLog(argv[1]);
    } else if (argc == 3) {
        puts(getChampMasteryHistory(argv[1], atoi(argv[2])).c_str());
    } else {
        return 1;
    }

}
