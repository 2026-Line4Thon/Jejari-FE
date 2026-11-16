export const matchingListPath = '/matches';
export const candidatePath = (id) => '/matches/' + id;
export const ownershipPath = (id) => candidatePath(id) + '/ownership';
export const returnConnectionPath = (candidateId, checkId) => candidatePath(candidateId) + '/return?checkId=' + encodeURIComponent(checkId);
