import Joi from "joi";

export const searchSchemaBody = Joi.object<SearchParams>({
  email: Joi.string().required(),
});

type SearchParams = {
  email: string;
};
