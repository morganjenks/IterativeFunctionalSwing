import numpy as np

def saw_method(bufferObject, start_phase=0, end_phase=1, params=None):
    freq = params[0] if params and len(params) > 0 else 1
    blend = params[1] if params and len(params) > 0 else 1

    total_samps = len(bufferObject)
    start_samp = int(start_phase * total_samps)
    end_samp = int(end_phase * total_samps)
    phase_range = end_phase - start_phase

    for i in range(start_samp, end_samp):
        local_phase = (freq * i / (end_samp - start_samp)) % 1
        parent_phase = start_phase + (local_phase * phase_range)
        bufferObject[i] = blend * parent_phase + (1 - blend) * bufferObject[i]
