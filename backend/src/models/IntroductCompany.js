import mongoose from "mongoose";

const introductCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
  },
  title: {
    titleName: {
      type: String,
      required: true
    },
    titleName_en: {
      type: String,
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
    descriptionName_en: {
      type: String,
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
    title_en: {
      type: String,
    },
    description: {
      type: String,
      required: true
    },
    description_en: {
      type: String,
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
    title_en: {
      type: String,
    },
    description: {
      type: String,
      required: true
    },
    description_en: {
      type: String,
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
      title_en: {
        type: String,
      },
      description: {
        type: String,
        required: true
      },
      description_en: {
        type: String,
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