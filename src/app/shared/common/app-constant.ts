/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { environment } from '@env';
// const environment = require('../../../assets/config/appConfig.json');
const vietnameseCharaters =
  'a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂưăạảấầẩẫậắằẳẵặẹẻẽếềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý';
// tslint:disable-next-line: max-line-length
const normalKey = 'a-zA-Z0-9';
const vniKey =
  'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂưăạảấầẩẫậắằẳẵặẹẻẽếềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý';
@Injectable()
export class AppConstant {
  public static format = {
    pipe: {
      fullDateTime: 'dd/MM/yyyy HH:mm:ss',
      fullDateTimeWithoutSecond: 'dd/MM/yyyy HH:mm',
      dateWithoutTimezone: 'dd/MM/yyyy',
      ISODate: 'DD/MM/YYYY',
      ISODateTimeWithoutTime: 'YYYY-MM-DD',
      currencyFormat: '',
      currencyCulture: 'en-gb',
    },
  };
  public static pattern = {
    notAllowJustSpace: /^.*[^ ].*$/,
    capitalizeChar: /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/,
    allowSpecialChar: /[!@#$%^&*(),.?":{}|<>]/g,
    lengthAndWithoutSpace: /^\S{8,15}$/,
    related: '#related',
    whiteSpace: '^\\S*$',
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    allowLetterWithSpecialCharacter: `^[${vietnameseCharaters} _,.-]+$`,
    specialCharacter: `^[${normalKey} ]+$`,
    specialCharacterNoSpace: `[${normalKey}]+$`,
    specialCharacterWithUnderScore: `[${normalKey}_]+$`,
    phoneNumber: '^[0-9]{10,11}$',
    emailFormat: /^\S+@\S+\.\S+$/,
    textUpperCase: '^[A-Z]*$',
    usingForWritingLocalStorage: '6b62c0c0-9b6c-4ac1-97e3-b326dc45291e',
    vniCharacterAndSpace: `(?!^ +$)^[${normalKey}${vniKey}_,. ]+$`,
    vniAndSpace: `(?!^ +$)^[${normalKey}${vniKey} ]+$`,
    numbericOnly: '^[0-9]*$',
    allowedUploadContractsExtensions: /(doc|docx|pdf|xls|xlsx|csv|png|jpeg|jpg)$/i,
    duplicateSpace: / +(?= )/g,
    websiteUrl: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(:\d{4})?(\/\S*)?$/,
    textAndDigits: /^[A-Za-z0-9]+$/,
    phoneNumberVietNamese: /^(0)(32|33|34|35|36|37|38|39|52|56|58|59|70|76|77|78|79|81|82|83|84|85|86|87|88|89|90|91|92|93|94|96|97|98|99)+([0-9]{7})$/,
    vnCharacterPattern: `[${vietnameseCharaters} ]*$`,
    hasAtLeastOneChar: `(.*[${vietnameseCharaters}].*)`
  };
}
