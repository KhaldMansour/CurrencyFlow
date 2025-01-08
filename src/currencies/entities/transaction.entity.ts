import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

  @Prop({ required: true })
    sourceCurrency: string;

  @Prop({ required: true })
    targetCurrency: string;

  @Prop({ required: true })
    amount: number;

  @Prop({ required: true })
    convertedAmount: number;

  @Prop({ required: true })
    exchangeRate: number;

  @Prop({ type: Date, default: () => Date.now() })
    createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
export type TransactionDocument = HydratedDocument<Transaction>;

TransactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.__v = undefined;
    return ret;
  }
});
