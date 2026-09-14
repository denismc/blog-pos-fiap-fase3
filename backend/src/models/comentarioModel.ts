import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema(
  {
    conteudo: { type: String, required: true, trim: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default Comentario;
