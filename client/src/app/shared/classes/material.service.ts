declare var M;

export class MaterialService {
  static toast(massage) {
    M.toast({ html: massage });
  }
}
