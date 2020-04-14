import re

rx_dict = {
    'topLevel': re.compile(r'toplevel "(?P<topLevel>.+)";'),
    'gateStatement': re.compile(r'("(.*?)" )+(?P<gate>.*?) ".*;'),
    'basicStatement': re.compile(r'("(?P<BE>.+)" )lambda=.*;')
}

def _parse_line(line):
    """
    Do a regex search against all define regex and
    return the key and match result of the first matching regex
    """

    for key, rx in rx_dict.items():
        match = rx.search(line)
        if match:
            return key, match
    
    return None, None

def parse_file(filePath):
    BEList = []
    gateList = []
    with open(filePath, 'r') as file_object:
        line = file_object.readline()

        while line:
            key, match = _parse_line(line)

            if key == 'topLevel':
                topLevel = match.group('topLevel')

            elif key == 'gateStatement':
                gateList.append(match.group('gate'))

            elif key == 'basicStatement':
                BEList.append(match.group('BE'))
            else:
                print("THIS LINE WAS EMPTY: " + line)
            line = file_object.readline()

    # gateList = list(set(gateList))
    BEList = list(set(BEList))
    # BEList.remove(topLevel)

    return gateList, BEList
