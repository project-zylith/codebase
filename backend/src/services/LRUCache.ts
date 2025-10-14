/*
    The overall objective is to build a way for the AI to utilize a cache of insights based on the frequency of request. Aka as the user makes calls to the AI I want to remove the LRU and cache the next item. The reason for
    thd cache vs the last only is so that I can cross reference to insure users aren't just getting the same responses.

    Or could I save the state of the last note along with the last insight so that if there is a call before the note has been changed then we can use the last insight. We also wouldn't need to update the store.

    Data Needs ----

    1) Cache Size (3)
    3) The user id, this is used to get the cache data from the db
    4) Current Note State
    5) Potentially a new db column "user_cache_note_insights" under the users. Which can be duplicated over the galaxy insights.
    6) Note Content
    7) MRU (most recently used) insight

    This system should work regardless of when the user last visited the app. This should save on operation cost and help with the speed of calls. Since I can reference our db vs the gemini api.

    */
