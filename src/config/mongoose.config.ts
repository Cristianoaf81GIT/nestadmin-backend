import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

export class MongooseConfigurations implements MongooseOptionsFactory {
  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    return {
      uri: process.env.MONGO_URI,
      useNewUrlParser: true,
      autoIndex: true,
      autoCreate: true,
      useUnifiedTopology: true,
    };
  }
}
