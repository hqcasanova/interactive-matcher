import { Recording } from "../recording.model";


export class SelectInput {
  static readonly type = '[Input] Select Recording';

  constructor(public recording: Recording) {
  }
}

export class SelectDatabase {
  static readonly type = '[Database] Select Recording';

  constructor(public recording: Recording) {
  }
}

export class SetAutoSearch {
  static readonly type = '[Config] Set AutoSearch';

  constructor(public isAutoSearch: boolean) {
  }
}