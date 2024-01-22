import Realm from 'realm';

export class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  username!: String;
  following?: Realm.List<Realm.BSON.ObjectId>;
  followers?: Realm.List<Realm.BSON.ObjectId>;
  deletedMessages?: Realm.List<Realm.BSON.ObjectId>;
  blockList?: Realm.List<Realm.BSON.ObjectId>;
  lastSeen?: Date;
  isOnline?: Boolean;
  profileImage?: String;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    properties: {
      username: 'string',
      _id: 'objectId',
      following: 'objectId[]',
      followers: 'objectId[]',
      deletedMessages: 'objectId[]',
      blockList: 'objectId[]',
      lastSeen: 'date?',
      isOnline: {type: 'bool', default: false, optional: true},
      createdAt: 'date',
      profileImage: 'string?',
    },
    primaryKey: '_id',
  };
}
