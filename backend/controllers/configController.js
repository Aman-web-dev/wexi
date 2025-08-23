import ConfigModal from "../models/configModel.js";

export const getConfig = async (req, res) => {
  try {
    const config = await ConfigModal.findOne();
    if (!config) {
      return res.status(404).json({
        status: "fail",
        message: "Configuration not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: config,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { autoCloseEnabled, confidenceThreshold, slaHours } = req.body;
    let config = await ConfigModal.findOne();

    if (!config) {
      config = new ConfigModal({
        autoCloseEnabled,
        confidenceThreshold,
        slaHours,
      });
    } else {
      if (autoCloseEnabled !== undefined)
        config.autoCloseEnabled = autoCloseEnabled;
      if (confidenceThreshold !== undefined)
        config.confidenceThreshold = confidenceThreshold;
      if (slaHours !== undefined) config.slaHours = slaHours;
    }
    await config.save();
    res.status(200).json({
      status: "success",
      data: config,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
