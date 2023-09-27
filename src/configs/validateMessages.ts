import { useTranslation } from "react-i18next";
import { ValidateMessages } from "rc-field-form/lib/interface";
export default () => {
  const { t } = useTranslation();
  const validateMessages: ValidateMessages = {
    required: t("${label} is required!").toString(),
    types: {
      email: t("${label} is not a valid email!").toString(),
      number: t("${label} is not a valid number!").toString(),
    },
    number: {
      range: t("${label} must be between ${min} and ${max}").toString(),
    },
    string: {
      min: t("${label} must be at least ${min} characters").toString(),
    },
  };
  return validateMessages;
};
