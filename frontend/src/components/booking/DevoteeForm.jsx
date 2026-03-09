function DevoteeForm({ index, devotee, handleChange }) {

  return (

    <div className="card p-3 mb-3">

      <h6>Devotee {index + 1}</h6>

      <input
        className="form-control mb-2"
        placeholder="Name"
        value={devotee.name}
        onChange={(e) =>
          handleChange(index, "name", e.target.value)
        }
      />

      <input
        className="form-control mb-2"
        placeholder="Age"
        value={devotee.age}
        onChange={(e) =>
          handleChange(index, "age", e.target.value)
        }
      />

      <select
        className="form-control"
        value={devotee.gender}
        onChange={(e) =>
          handleChange(index, "gender", e.target.value)
        }
      >

        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>

      </select>

    </div>

  );
}

export default DevoteeForm;