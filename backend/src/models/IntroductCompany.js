import mongoose from "mongoose";

const introductCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    titleName: {
      type: String,
      required: true
    },
    titleIcon: {
      type: String,
      required: true
    }

  },
  description: {
    descriptionName: {
      type: String,
      required: false
    },
    descriptionIcon: {
      type: String,
      required: false
    }

  },
  image: {
    type: [String]
  },
  mission: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  },
  vision: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  },
  coreValues: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String
      },
      date: {
        type: Number,
        required: true
      }
    }
  ]
},
  {
    timestamps: true
  }
);

export default mongoose.model("IntroductCompany", introductCompanySchema);