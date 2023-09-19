type AS = 'tSide' | 'bSide' | 'lSide' | 'rSide';
type AP = 'mhPos' | 'mvPos' | 'lPos' | 'rPos' | 'tPos' | 'bPos';
type AD = 'tDir' | 'bDir' | 'lDir' | 'rDir';
type ArrowCreationKey = keyof AS | keyof AP | keyof AD;
