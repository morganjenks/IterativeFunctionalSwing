import numpy as np

def bjorklund_method(bufferObject, start_phase=0, end_phase=1, params=None):
    """
    Equivalent to the toussaintGlobal.method in JavaScript.
    Generates a waveform using the given parameters.

    Args:
        buffer_length (int): The length of the buffer array.
        sample_rate (int): The sampling rate in Hz. Defaults to 44100.
        start_phase (float): The starting phase (0 to 1).
        end_phase (float): The ending phase (0 to 1).
        params (list): Optional parameters [total_steps, hits, rotation, blend].

    Returns:
        np.ndarray: The computed buffer values.
    """
    # Set defaults for params
    total_steps = params[0] if params and len(params) > 0 else 8
    hits = params[1] if params and len(params) > 1 else 3
    rotation = params[2] if params and len(params) > 2 else 0
    blend = params[3] if params and len(params) > 3 else 0.5

    # Compute total sample count and start/end indices
    start_samp = int(start_phase * len(bufferObject))
    end_samp = int(end_phase * len(bufferObject))
    mutation_magnitude = (end_samp - start_samp) / len(bufferObject)
    print("mutation mag")
    print(mutation_magnitude)
    # Generate a simple Euclidean pattern
    def euc_bjorklund(steps, hits):
        """Bjorklund's algorithm for Euclidean rhythms."""
        if hits == 0:
            return [0] * steps
        if hits == steps:
            return [1] * steps

        pattern = []
        counts = []
        remainders = [hits]
        divisor = steps - hits
        level = 0

        while remainders[level] > 1:
            counts.append(divisor // remainders[level])
            remainders.append(divisor % remainders[level])
            divisor = remainders[level]
            level += 1
        counts.append(divisor)

        def build(level):
            if level == -1:
                pattern.append(0)
            elif level == -2:
                pattern.append(1)
            else:
                for _ in range(counts[level]):
                    build(level - 1)
                if remainders[level] != 0:
                    build(level - 2)

        build(level)
        return pattern

    # Generate Euclidean rhythm
    euc_pattern = euc_bjorklund(total_steps, hits)

    # Apply rotation
    euc_pattern = euc_pattern[-rotation:] + euc_pattern[:-rotation]
    print(euc_pattern)
    # Scale Euclidean pattern to the buffer range
    step_values = np.cumsum(euc_pattern) / sum(euc_pattern) if sum(euc_pattern) > 0 else np.zeros_like(euc_pattern)
    print(step_values)
    # Interpolate step values into the buffer range
    for i in range(start_samp, end_samp):
        
        phase = (i - start_samp) / (end_samp - start_samp)
        step_idx = int(phase * len(step_values))
        step_value = step_values[step_idx]

        parent_step_value = start_phase + (step_value * mutation_magnitude)
        # Linear interpolation with mutation magnitude
        
        bufferObject[i] = blend * parent_step_value + (1 - blend) * bufferObject[i]

    return bufferObject
