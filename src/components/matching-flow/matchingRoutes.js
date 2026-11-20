export const matchingListPath = '/matches';
export const matchingOverviewPath = '/my-matches';
export const candidatePath = (id) => '/matches/' + id;
export const ownershipPath = (id) => candidatePath(id) + '/ownership';
export const returnConnectionPath = (candidateId, checkId) => candidatePath(candidateId) + '/return?checkId=' + encodeURIComponent(checkId);

export function candidateBackPath(state) {
  if (['/mypage', matchingOverviewPath, '/home', '/find'].includes(state?.returnTo)) return state.returnTo;
  return matchingListPath + (state?.lostItemId ? '?itemId=' + encodeURIComponent(state.lostItemId) : '');
}
