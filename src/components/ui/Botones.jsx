const Botones = ({ onCancel }) => (
  <div className="flex justify-end space-x-4 pt-6">
    <button
      type="button"
      onClick={onCancel}
      className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Guardar
    </button>
  </div>
);

export default Botones;
