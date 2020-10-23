//Sample job using language-postgresql
//FOR mapping assessment_site records to Postgres
upsert('cks_pnpcity', 'qid', {
  intname: state.data.kobo.INTName, //state.data.pathToKey
  idate: state.data.kobo.Idate, 
  qid: state.data.kobo.QID //if using `id` for the upsert key, we need to map it, Dane have change to qid
  //new mapping here
  // ...
});

//FOR MAPPING KOBO REPEAT GROUPS --> to insert multiple records in the DB
insertMany('cks_pnpcity_member', state => //Different syntax for repeat groups because it returns an array
  state.data.kobo.Member.map(m => ({  //state.data.GroupName... we are mapping every object `m` in the Members[] Array
    //mid: state.data.kobo.MQID, //this syntax will not work for repeat groups because Kobo returns an array
    mid: m[`Member/MQID`], //for every Member 'm', return Member/MQID here
    e22name: m[`Member/E22Name`], //for every Member 'm', return Member/E22Name
    e22age: m[`Member/E22Age`]
  }))
);
