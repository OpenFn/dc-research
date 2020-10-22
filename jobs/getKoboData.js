alterState(state => {
  manualCursor = '2020-05-25T14:32:43.325+01:00';
  state.data = {
    surveys: [
      //update id with Kobo form id to fetch // aikZyWqnXGXAqtToyoHWQK 
      { id: 'aj29Df44QvPWV3YLgyc7xZ', tag: 'frm_TestOpenFn' },
      //{ id: 'another-formId', tag: 'new_survey2' },
      
    ].map(survey => ({
      formId: survey.id,
      tag: survey.tag,
      url: `https://kf.kobotoolbox.org/api/v2/assets/${survey.id}/data/?format=json`,
      query: `&query={"end":{"$gte":"${state.lastEnd || manualCursor}"}}`,
    })),
  };
  return state;
});

each(dataPath('surveys[*]'), state => {
  const { url, tag, formId } = state.data;
  return get(url, {}, state => {
    state.data.submissions = state.data.results.map((submission, i) => {
      return {
        i,
        form: tag,
        kobo: submission
      };
    });
    const count = state.data.submissions.length;
    console.log(`Fetched ${count} submissions from ${formId} (${tag}).`);
    return each(dataPath('submissions[*]'), state => {
      console.log(`Posting ${state.data.i + 1} of ${count}...`);
      return post(state.configuration.openfnInboxUrl, { body: state => state.data })(state);
    })(state);
  })(state);
});

alterState(state => {
  const lastEnd = state.references
    .filter(item => item.body)
    .map(s => s.body.end)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return { ...state, lastEnd };
});
