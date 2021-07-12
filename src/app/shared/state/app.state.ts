import { Action, Selector, State, StateContext } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { Recording } from "../recording.model";
import { SelectDatabase, SelectInput, SetAutoSearch } from "./app.actions";


export class AppStateModel {
  selInput: Recording | undefined;
  selDatabase: Recording | undefined;
  isAutoSearch: boolean | undefined;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    selInput: undefined,
    selDatabase: undefined,
    isAutoSearch: environment.defaultAutoSearch
  }
})

export class AppState {

  constructor() {
  }

  @Selector()
  static getSelInput(state: AppStateModel) {
      return state.selInput;
  }

  @Selector()
  static getSelDatabase(state: AppStateModel) {
      return state.selDatabase;
  }

  @Selector()
  static isFullSelection(state: AppStateModel) {
      return state.selDatabase && state.selInput;
  }

  @Selector()
  static getAutoSearch(state: AppStateModel) {
      return state.isAutoSearch;
  }

  @Action(SelectInput)
  selectInput({ patchState }: StateContext<AppStateModel>, { recording }: SelectInput) {
    patchState({
      selInput: recording
    });
  }

  @Action(SelectDatabase)
  selectDatabase({ patchState }: StateContext<AppStateModel>, { recording }: SelectDatabase) {
    patchState({
      selDatabase: recording
    });
  }

  @Action(SetAutoSearch)
  setAutoSearch({ patchState }: StateContext<AppStateModel>, { isAutoSearch }: SetAutoSearch) {
    patchState({
      isAutoSearch
    });
  }
}